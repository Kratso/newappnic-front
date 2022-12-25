import React from 'react';
import { useSelector } from 'react-redux';
import {useParams} from 'react-router-dom';
import { selectViajeById } from '../../slices/viajes.slice';
import { RootState } from '../../store/store';

const ViajeDetail = () => {
    const {_id } = useParams();
    const viaje = useSelector((state: RootState) => selectViajeById(state, _id ?? ''))
    console.log(_id, viaje)

    return <></>
}

export default ViajeDetail;