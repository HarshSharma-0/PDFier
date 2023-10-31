import {Image} from 'react-native';

export function get_act(path) {
  return new Promise((resolve, reject) => {
    const Size = { WIDTH: 0, HEIGHT: 0 };
    Image.getSize(path, (width, height) => {
      Size.WIDTH = width;
      Size.HEIGHT = height;
      resolve(Size);
    });
  });
}
