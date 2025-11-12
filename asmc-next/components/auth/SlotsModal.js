import { format } from 'date-fns';
import { Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const SlotsModal = ({ slotData = [] }) => {
    console.log(slotData, "slotData");
    
    return (
        <div className="container pt-lg-5">
            {
                slotData && slotData.length > 0 ? (
                    <Fragment>
                        <div className="row border-bottom border-top">
                            {slotData && slotData.map((obj, index) => (
                                <Col key={index} className='text-center p-3 active'>
                                    <h5>{obj.day}</h5>
                                </Col>
                            ))}
                        </div>
                        <div className="row">
                            {slotData && slotData.map((obj, index) => (
                                <Col key={index} className='text-center p-3 d-flex flex-column align-items-center'>
                                    {
                                        obj.slots.length > 0 && obj.slots.map((dateObj, index) => (
                                            <p class="link-row active link-slots">
                                                {format(dateObj.from, "hh:mm a")} - {format(dateObj.to, "hh:mm a")}
                                            </p>
                                        ))
                                    }
                                </Col>
                            ))}
                        </div>
                    </Fragment>
                )
                    :
                    <p className="text-center">No slots available</p>
            }

        </div>
    )
}