import React, {useEffect} from 'react'

import { useDispatch } from 'react-redux';

import {Typography} from "antd";

const {Title, Paragraph} = Typography;

import { log } from "../../redux/console";

const Home = (): JSX.Element => {
    const dispatch = useDispatch();

    useEffect(() => {
        const f = log('Home page loaded');
        const g = log(100);

        dispatch(f);
        dispatch(g);
    }, []);

    return (
        <div>
            <Title>
                Vehicular Inc.
            </Title>

            <Paragraph
                strong={true}
            >
                As a logistics company, we have a diverse fleet of vehicles to meet the transportation needs of our
                clients. Our vehicles are well-maintained and equipped with the latest technology to ensure safe and
                efficient transport of your goods. Here is a list of the vehicles in our fleet:

                <ul style={{ textAlign: 'left' }}>
                    <li>Cargo Vans</li>
                    <li>Sprinter Vans</li>
                    <li>Straight Trucks (Box Trucks)</li>
                    <li>Flatbed Trucks</li>
                    <li>Refrigerated Trucks</li>
                    <li>Dry Vans</li>
                    <li>Step Deck Trailers</li>
                    <li>Double Drop Trailers</li>
                    <li>Lowboy Trailers</li>
                    <li>Intermodal Containers</li>
                </ul>

                Our fleet is constantly expanding and evolving to meet the changing needs of the industry. If you have
                any specific transportation requirements, please don't hesitate to contact us. We will work with you to
                develop a customized transportation solution that fits your needs perfectly.
            </Paragraph>
        </div>
    )
}

export default Home
