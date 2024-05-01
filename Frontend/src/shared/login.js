import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Axios from 'axios';

import Header from '../Usercomponents/Header';
import { setAuthUser, getAuthUser } from '../helper/Storage';

import classes from './login.module.css';

function Login() {
	const auth = getAuthUser();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm();

	const emailChangeHandler = event => {
		setEmail(event.target.value);
	};

	const passwordChangeHandler = event => {
		setPassword(event.target.value);
	};

	const submitHandler = async event => {
		// Prevent reload after form submission
		event.preventDefault();

		const data = { email, password };

		try {
			const result = await Axios.post('http://localhost:4000/auth/login', data);

			setAuthUser(result.data);
			if (result.data.type.toString() === 'admin') {
				console.log('it should navigate to ManageAppointments');
				navigate('/managetrav');
			} else {
				navigate('/hajjtickets');
			}
		} catch (err) {
			const errors = err.response.data;

			if (errors.err) {
				setError('email', {
					type: 'server',
					// message: "wrong email"
				});
			}
			if (errors.errors[0].msg) {
				setError('password', {
					type: 'server',
					message: errors.errors[0].msg,
				});
			}
		}
	};

	return (
		<>
			<Header />
			<div className={classes.wrapper}>
				{errors.email && (
					<p className={classes.error}>
						{errors.email.message} Something went wrong with email
					</p>
				)}
				{errors.password && (
					<p className={classes.error}>
						{errors.password.message} password at least 8 characters
					</p>
				)}
				<h2>Login</h2>
				<form onSubmit={submitHandler}>
					<div className={classes['input-box']}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='text'
							// placeholder='Enter your email'
							required
							{...register('email', {
								pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
							})}
							value={email}
							onChange={emailChangeHandler}
						/>
					</div>
					<div className={classes['input-box']}>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							name='password'
							type='password'
							// placeholder='Password'
							required
							{...register('password', {
								minLength: 8,
							})}
							value={password}
							onChange={passwordChangeHandler}
						/>
					</div>

					<div className={classes['input-box']}>
						<button className={classes['btn--login']} type='Submit'>
							Login
						</button>
					</div>
					<div className={classes.text}>
						<h3>
							Don't have an account? <br />{' '}
							<Link style={{ color: "#d3b923" }} to='/register'>Register Now</Link>
						</h3>
					</div>
				</form>
			</div>
		</>
	);
}
export default Login;
