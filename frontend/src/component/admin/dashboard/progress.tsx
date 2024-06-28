import React from 'react';
import { Flex, Progress } from 'antd';

const Progresses: React.FC = () => (
    <div style={{display: 'flex', gap: '20px'}}>
        <Flex gap="small" vertical style={{ width: '50%', marginTop: '20px' }}>
            <Progress percent={30} />
            <Progress percent={50} status="active" />
            <Progress percent={70} status="exception" />
            <Progress percent={100} />
            <Progress percent={50} showInfo={false} />
        </Flex>
        <Flex gap="100px" wrap justify='center' style={{ width: '50%', marginTop: '20px' }}>
            <Progress type="circle" percent={75} />
            <Progress type="circle" percent={70} status="exception" />
            <Progress type="circle" percent={100} />
        </Flex>
    </div>

);

export default Progresses;