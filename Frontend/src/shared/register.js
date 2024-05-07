import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import Axios from 'axios';

import Header from '../Usercomponents/Header';

import classes from './register.module.css';

const Register = () => {
	const navigate = useNavigate();

	const [error, setError] = useState('');

	const [username, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const usernameChangeHandler = event => {
		setName(event.target.value);
	};

	const phoneChangeHandler = event => {
		setPhone(event.target.value);
	};

	const passwordChangeHandler = event => {
		setPassword(event.target.value);
	};

	const emailChangeHandler = event => {
		setEmail(event.target.value);
	};

	const submitHandler = async event => {
		// Prevent reload after form submission
		event.preventDefault();//

		const data = { username, password, email, phone };
		try {
			const response = await Axios.post(
				'http://localhost:5002/api/register',
				data
			);

			//console.log(response);
			// console.log('submitted');

			navigate('/login');//
		} catch (error) {
			// handle error response
			console.log(error);
			if (error.response) {
				setError(error.response.data.errors[0].msg);
				//alert(error.response.data.errors[0].msg);
			} else {
				setError('Something went wrong. Please try again later.');
			}
		}
	};

	return (
		<>
			<Header />
			<div className={classes.wrapper}>
				{error && <h4 className={classes.error}>{error}</h4>}
				<h2>Registration</h2>
				<form onSubmit={submitHandler}>
					<div className={classes['input-box']}>
						<label htmlFor='name'>Name</label>
						<input
							id='name'
							name='name'
							type='text'
							required
							value={username}
							onChange={usernameChangeHandler}
						/>
						{errors.name && <p className={classes.error}>Enter your name</p>}
					</div>
					<div className={classes['input-box']}>
						<label htmlFor='phone'>Phone</label>
						<input
							id='phone'
							name='phone'
							type='text'
							required
							value={phone}
							onChange={phoneChangeHandler}
						/>
						{errors.name && <p className={classes.error}>Enter your phone</p>}
					</div>
					<div className={classes['input-box']}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='email'
							required
							value={email}
							onChange={emailChangeHandler}
						/>
						{errors.email?.type === 'required' && (
							<p className='error'>enter your email</p>
						)}
						{errors.email?.type === 'pattern' && (
							<p className='error'>enter a valid email</p>
						)}
					</div>
					<div className={classes['input-box']}>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							name='password'
							type='password'
							// {...register('password', { required: true, minLength: 8 })}
							required
							value={password}
							onChange={passwordChangeHandler}
						/>
						{errors.password?.type === 'required' && (
							<p className={classes.error}>Enter your password</p>
						)}
						{errors.password?.type === 'minLength' && (
							<p className={classes.error}>
								Password must be at least 8 characters
							</p>
						)}
					</div>
					<div className={classes['input-box']}>
						<button className={classes['btn--submit']} type='submit'>
							Register Now
						</button>
					</div>
					<div className={classes.text}>
						<h3>
							Already have an account? <Link to='/login' style={{ color: "#d3b923" }}>Login now</Link>
						</h3>
					</div>
				</form>
			</div>
		</>
	);
};

export default Register;
