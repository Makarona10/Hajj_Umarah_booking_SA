import React, { useState, useRef } from 'react';
import axios from 'axios';
import { getAuthUser } from '../helper/Storage';

import '../AdminStyle/AddTrav.css';
import '../AdminStyle/Addapp.css';

import classes from '../AdminStyle/AddAppointment.module.css';

const Addapp = ({ OnAddAppointment }) => {
	const auth = getAuthUser();
	/*const [name, setName] = useState('');
	const [from_where, setFrom] = useState('');
	const [to_where, setTo] = useState('');
	const [ticket_price, setPrice] = useState('');
	const [day_and_time, setTime] = useState('');*/
	const [movie, setMovie] = useState({
		name: "",
		from_where: "",
		to_where: "",
		ticket_price: "",
		day_and_time: "",
		err: "",
		loading: false,
		success: null,
	});

	const image = useRef(null);


	//const image = useRef(null);
	const submitHandler = (e) => {
		e.preventDefault();
		setMovie({ ...movie, loading: true });

		const formData = new FormData();
		formData.append("name", movie.name);
		formData.append("from_where", movie.from_where);
		formData.append("to_where", movie.to_where);
		formData.append("ticket_price", movie.ticket_price);
		formData.append("day_and_time", movie.day_and_time);
		if (image.current.files && image.current.files[0]) {
			formData.append("image", image.current.files[0]);
		}
		try {
			axios.post(
				'http://localhost:5000/hajj',
				formData,
				{
					headers: {
						token: auth.token,
						"Content-Type": "multipart/form-data",
					},
				}
			).then((resp) => {
				OnAddAppointment();
				setMovie({
					name: "",
					from_where: "",
					to_where: "",
					ticket_price: "",
					day_and_time: "",
					err: null,
					loading: false,
					success: "Movie Created Successfully !",
				});
				image.current.value = null;
			});

			//reset();
			hideModal();
		} catch (error) {
			console.error(error);
		}
	};

	const hideModal = () => {
		const x = document.getElementById('add-appointment-modal');
		x.style.display = 'none';
	};

	// const reset = () => {


	// 	setName('');
	// 	setFrom('');
	// 	setTo('');
	// 	setPrice('');
	// 	setTime('');
	// 	//image.current.value = null;
	// };

	return (
		<form
			id='add-appointment-modal'
			className={classes['add-modal']}
			onSubmit={submitHandler}>
			<h4>Add Appointments</h4>
			<div>
				<label>Name</label>
				<input
					type='text'
					className='form-control'
					required
					value={movie.name}
					onChange={(e) => setMovie({ ...movie, name: e.target.value })}
				/>
			</div>
			<div>
				<label>From</label>
				<input
					type='text'
					className='form-control'
					required
					value={movie.from_where}
					onChange={(e) => setMovie({ ...movie, from_where: e.target.value })}
				/>
			</div>
			<div>
				<label>To</label>
				<input
					type='text'
					className='form-control'
					required
					value={movie.to_where}
					onChange={(e) => setMovie({ ...movie, to_where: e.target.value })}
				/>
			</div>
			<div>
				<label>Ticket price</label>
				<input
					type='text'
					className='form-control'
					required
					value={movie.ticket_price}
					onChange={(e) => setMovie({ ...movie, ticket_price: e.target.value })}
				/>
			</div>
			<div>
				<label htmlFor='datetime'>Date and time</label>
				<input
					type='datetime-local'
					id='datetime'
					name='datetime'
					className='form-control'
					required
					value={movie.day_and_time}
					onChange={(e) => setMovie({ ...movie, day_and_time: e.target.value })}
				/>
			</div>


			<div>
				<label> Image</label>
				<input
					type='file'
					className='form-control'
					required
					ref={image}

				/>
			</div>



			<div className={classes['btn-box']}>
				<button
					className={classes['btn-cancel']}
					type='button'
					data-dismiss='modal'
					onClick={hideModal}>
					Cancel
				</button>
				<button className={classes['btn-save']} type='submit'>
					Add
				</button>
			</div>
		</form>
	);
};

export default Addapp;
