import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import styles from './index.scss';

class CustomComponent extends Component {
  state = {
    files: [],
    isLoading: false,
    isAbort: false,
    filePromise: null,
    progress: 0,
  };

  componentDidMount = () => {
    this.setState({
      files: this.props.value,
    });
  };

  abortUpload = () => {
    // 中断上传
    this.state.filePromise.abort();
    this.setState({
      isAbort: true,
      isLoading: false,
      filePromise: null,
      progress: 0,
    });
  };

  delImage = index => {
    const { onChange } = this.props;
    const { files } = this.state;
    files.splice(index, 1);
    this.setState({
      files,
    });
    onChange(files);
  };

  pickImage = () => {
    // 选择图片
    const { size, url, name, header, formData, onChange } = this.props;
    const { files, isAbort } = this.state;

    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      if (res.tempFiles[0].size > 1024 * 1024 * size) {
        Taro.atMessage({
          message: `图片大小超过了${size}M`,
          type: 'error',
        });
      } else {
        const filePromise = Taro.uploadFile({
          url, // 仅为示例，非真实的接口地址
          filePath: res.tempFiles[0].path,
          name,
          formData,
          header,
          success: response => {
            const data = JSON.parse(response.data);
            let fileList = [];
            switch (data.code) {
              case 0:
                fileList = [...files, data.content];
                this.setState({
                  files: fileList,
                });
                onChange(fileList);
                break;
              default:
                Taro.atMessage({
                  message: '图片上传失败，请稍后重试！',
                  type: 'error',
                });
                break;
            }
          },
          fail: () => {
            if (isAbort === false) {
              Taro.atMessage({
                message: '图片上传失败，请稍后重试！',
                type: 'error',
              });
            } else {
              this.setState({
                isAbort: false,
              });
            }
          },
          complete: () => {
            this.setState({
              isLoading: false,
              progress: 0,
            });
          },
        });

        filePromise.progress(r => {
          this.setState({
            progress: r.progress,
          });
        });

        this.setState({
          isLoading: true,
          filePromise,
        });
      }
    });
  };

  render() {
    const { length } = this.props;
    const { progress, files, isLoading } = this.state;
    return (
      <View>
        {files.map((item, index) => {
          return (
            <View
              key={item.path}
              className={`${styles.box} ${styles.image}`}
              style={{
                backgroundImage: `url('${item.url}')`,
              }}
            >
              <View className={styles.close} onClick={this.delImage.bind(this, index)} />
            </View>
          );
        })}
        {length > files.length &&
        isLoading === false && ( // 小于最大长度显示上传组件
            <View className={`${styles.box} ${styles.picker}`} onClick={this.pickImage} />
          )}
        {isLoading === true && (
          <View className={styles.box}>
            <View className={styles.close} onClick={this.abortUpload} />
            <AtActivityIndicator size={88} mode="center" />
            <Text className={styles.progress}>{progress}%</Text>
          </View>
        )}
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  onChange: () => {},
  formData: {},
  header: {},
  value: [],
  length: 1,
  name: '',
  url: '',
  size: 2,
};

export default CustomComponent;
