import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SideBar from './SideBar';
import Addapp from './Addapp';
import Editapp from './Editapp';

import { getAuthUser } from '../helper/Storage';

// import '../AdminStyle/Mangeapp.css';
import classes from '../AdminStyle/MangeAppointments.module.css';
import '../App.css';

const ManageAppointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [editId, setEditId] = useState(null);
	const auth = getAuthUser();

	const getAllAppointments = async () => {
		try {
			const response = await axios.get(
				`http://localhost:4000/appointments/all`
			);
			setAppointments(response.data);
			console.log(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getAllAppointments();
	}, []);

	function display() {
		const x = document.getElementById('add-appointment-modal');
		x.style.display = 'flex';
	}
	function displayedit(id) {
		setEditId(id);
		const x = document.getElementById('edit-modal');
		x.style.display = 'flex';
	}
	const handleDelete = async id => {
		try {
			await axios.delete(`http://localhost:4000/appointments/${id}`, {
				headers: {
					token: auth.token,
				},
			});
			setAppointments(
				appointments.filter(appointment => appointment.id !== id)
			);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={classes.wrapper}>
			<SideBar />

			<main className={classes.main}>
				<h2>Manage Appointments</h2>

				{appointments.length > 0 && (
					<table className='table table-striped table-hover'>
						<thead>
							<tr>
								<th>Name</th>
								<th>From</th>
								<th>To</th>
								<th>Ticket Price</th>
								<th>Day and Time</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map(appointment => (
								<tr key={appointment.id}>
									<td>{appointment.name}</td>
									<td>{appointment.from_where}</td>
									<td>{appointment.to_where}</td>
									<td>{appointment.ticket_price} EGP</td>
									<td>
										{appointment.day_and_time.toLocaleString('en-GB', {
											timeZone: 'EAT',
										})}
									</td>
									<td>
										<div className={classes['btn-box']}>
											<button className='edit' data-toggle='modal'>
												<i
													className='material-icons'
													title='Edit'
													onClick={() => displayedit(appointment.id)}>
													&#xE254;
												</i>
											</button>
											<button className='delete' data-toggle='modal'>
												<i
													className='material-icons'
													title='Delete'
													onClick={() => {
														if (
															window.confirm(
																'Are you sure you wish to delete this appointment?'
															)
														)
															handleDelete(appointment.id);
													}}>
													&#xE872;
												</i>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{appointments.length === 0 && (
					<h2 className='no-data'>No Appointments Found!</h2>
				)}
				<button
					style={{ color: "black", background: "#d3b923", border: "none" }}
					className='btn btn-success margin-bottom-md'
					data-toggle='modal'
					onClick={display}>
					Add Appointment
				</button>
			</main>

			<Addapp OnAddAppointment={getAllAppointments} />
			<Editapp id={editId} OnEditAppointment={getAllAppointments} />
		</div>
	);
};

export default ManageAppointments;
