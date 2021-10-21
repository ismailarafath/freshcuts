import { React, useEffect, useState } from 'react';
import { useHistory, useLocation , useParams } from 'react-router';

const ViewC = () => {
    const param = useParams();
    console.log(param.token);
    
    return (
        <div>
            view Certificate {param.token}
        </div>
    );
}

export default ViewC;