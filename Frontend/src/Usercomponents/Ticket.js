import React from 'react';
import { getAuthUser } from '../helper/Storage';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classes from '../UserStyle/Ticket.module.css';

const Ticket = (props) => {
	const [showForm, setShowForm] = useState(false);
	const [sort, setSort] = useState('');
	const [message, setMessage] = useState('');
	const user = getAuthUser();
	const navigate = useNavigate();

	const handleButtonClick = () => {
		setShowForm(true);
	};

	const request = () => {
		if (user) {
			const id = user.id;
			Axios.post(`http://localhost:4000/request/create/${props.id}/${id}`);
		} else {
			navigate('/login');
		}
	};

	const handleTransportationChange = (event) => {
		setSort(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await Axios.post('http://localhost:4001/transport/', { sort });

			if (response.status === 200) {
				const data = response.data;
				console.log(data.msg); // Success message

				// Make the request after successful reservation
				request();
				setMessage('Reservation successful');
				console.log('Reservation successful');
			} else {
				setMessage('Reservation failed');
				console.log('Reservation failed');
			}
		} catch (error) {
			setMessage('Reservation failed');
			console.error('Error:', error);
		}

		setShowForm(false);
	};

	return (
		<li key={props.id} className={classes.ticket}>
			<img src={props.image} alt={props.name} />
			<h2>{props.name}</h2>
			<h4>From: {props.from_where}</h4>
			<h4>To: {props.to_where}</h4>
			<h4>Ticket Price: {props.ticket_price}</h4>
			<h4>Day and Time: {props.day_and_time}</h4>
			{message && <p>{message}</p>}
			{!showForm ? (
				<button onClick={handleButtonClick} id={classes.request}>
					Request
				</button>
			) : (
				<form className={classes.trans} onSubmit={handleSubmit}>
					<label>
						Select Transportation:
						<select value={sort} onChange={handleTransportationChange}>
							<option value="">--Select--</option>
							<option value="AIR">Air</option>
							<option value="Ground">Ground</option>
							<option value="Nautical voy">Nautical</option>
						</select>
					</label>
					<button id={classes.request} type="submit">Reserve</button>
				</form>
			)}

		</li>
	);
};

export default Ticket;
