import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PaymentStatus = () => {
    const router = useRouter();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (router.query.response) {
            const response = JSON.parse(decodeURIComponent(router.query.response));
            setStatus(response);
        }
    }, [router.query.response]);

    if (!status) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Payment Status</h1>
            {status.order_status === 'Success' ? (
                <div>
                    <h2>Payment Successful</h2>
                    <p>Order ID: {status.order_id}</p>
                    <p>Amount: {status.amount}</p>
                    <p>Transaction ID: {status.tracking_id}</p>
                </div>
            ) : (
                <div>
                    <h2>Payment Failed</h2>
                    <p>Order ID: {status.order_id}</p>
                    <p>Failure Message: {status.failure_message}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentStatus;
