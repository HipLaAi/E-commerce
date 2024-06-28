import { Liquid } from '@ant-design/plots';

const DropWater = () => {
  const config = {
    percent: 0.7,
    style: {
      shape: 'pin',
      textFill: '#fff',
      outlineBorder: 4,
      outlineDistance: 8,
      waveLength: 128,
    },
  };
  return <Liquid {...config} />;
};

export default DropWater