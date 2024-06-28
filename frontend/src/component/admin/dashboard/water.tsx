import { Liquid } from '@ant-design/plots';

const Water = () => {
  const config = {
    percent: 0.9,
    style: {
      outlineBorder: 4,
      outlineDistance: 8,
      waveLength: 128,
    },
  };
  return <Liquid {...config} />;
};

export default Water;