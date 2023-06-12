import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import './Checkout.css';

const CheckoutForm = ({ item, price, id }) => {
	// const { name } = cart;
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useAuth();
	const [axiosSecure] = useAxiosSecure();
	const [cardError, setCardError] = useState('');
	const [clientSecret, setClientSecret] = useState('');
	const [processing, setProcessing] = useState(false);
	const [transactionId, setTransactionId] = useState('');

	useEffect(() => {
		if (price > 0) {
			axiosSecure.post('/create-payment-intent', { price }).then((res) => {
				console.log(res.data.clientSecret);
				setClientSecret(res.data.clientSecret);
			});
		}
	}, [price, axiosSecure]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const card = elements.getElement(CardElement);
		if (card === null) {
			return;
		}

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card,
		});

		if (error) {
			console.log('error', error);
			setCardError(error.message);
			return;
		} else {
			setCardError('');
		}

		setProcessing(true);

		const { paymentIntent, error: confirmError } =
			await stripe.confirmCardPayment(clientSecret, {
				payment_method: paymentMethod.id,
			});

		if (confirmError) {
			console.log(confirmError);
			setProcessing(false);
			return;
		}

		console.log('payment intent', paymentIntent);
		setProcessing(false);

		if (paymentIntent.status === 'succeeded') {
			setTransactionId(paymentIntent.id);
			// Save payment information to the server
			const payment = {
				email: user?.email,
				transactionId: paymentIntent.id,
				price,
				date: new Date(),
				quantity: item.length,
				cartItems: id,
				status: 'service pending',
				itemNames: item.name,
			};

			axiosSecure.post(`/payments/${id}`, payment).then((res) => {
				console.log(res.data);
				if (res.data.result.insertedId) {
					// Display confirmation message
				}
			});
		}
	};

	return (
		<>
			<form className="w-2/3 m-8" onSubmit={handleSubmit}>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: '16px',
								color: '#424770',
								'::placeholder': {
									color: '#aab7c4',
								},
							},
							invalid: {
								color: '#9e2146',
							},
						},
					}}
				/>
				<button
					className="btn btn-primary btn-sm mt-4"
					type="submit"
					disabled={!stripe || !clientSecret || processing}
				>
					Pay
				</button>
			</form>
			{cardError && <p className="text-red-600 ml-8">{cardError}</p>}
			{transactionId && (
				<p className="text-green-500">
					Transaction complete with transactionId: {transactionId}
				</p>
			)}
		</>
	);
};

export default CheckoutForm;