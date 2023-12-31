import 'daisyui/dist/full.css';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../Shared/SectionTitle/SectionTitle';

const img_hosting = import.meta.env.VITE_TOKEN;

const AddAClass = () => {
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		reset,
		// watch,
		formState: { errors },
	} = useForm();

	const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting}`;
	console.log(img_hosting);
	const [axiosSecure] = useAxiosSecure();

	const onSubmit = (data) => {
		console.log(data);
		const formData = new FormData();
		formData.append('image', data?.image[0]);
		fetch(img_hosting_url, {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((imgResponse) => {
				console.log(imgResponse);
				if (imgResponse) {
					const imgURL = imgResponse.data.display_url;
					console.log(imgURL);
					const { name, price, seat } = data;
					const newItem = {
						name: name,
						image: imgURL,
						price: price,
						seat: seat,
						email: user?.email,
						instructor: user?.displayName,
					};
					console.log(data);
					axiosSecure.post('/requestadmin', newItem).then((data) => {
						console.log('after posting new menu items', data.data);
						reset();
						if (data.data.insertedId) {
							Swal.fire(
								'posted success!',
								'Your file has been posted.',
								'success'
							);
						}
					});
				}
			});
	};

	return (
		<div>
			<SectionTitle heading={'Add A Class'} />
			<div className="flex items-center justify-center w-full h-screen px-5 bg-gray-200">
				<Helmet>
					<title>Academy of Dance Art || Add A Class</title>
				</Helmet>

				<div className="w-full  p-6 bg-white rounded-lg shadow-lg">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex  gap-2">
							<div className="mb-4 w-full">
								<label htmlFor="example" className="block text-sm">
									Name:
								</label>
								<input
									type="text"
									id="name"
									placeholder="Name"
									className="input input-bordered w-full"
									{...register('name', { required: true })}
								/>
								{errors.name && (
									<p className="text-red-500 text-xs">This field is required</p>
								)}
							</div>
							<div className="mb-4 w-full">
								<label htmlFor="example" className="block text-sm">
									Instructor Name:
								</label>
								<input
									type="text"
									id="example"
									className="input input-bordered w-full"
									defaultValue={user.displayName}
									readOnly
									placeholder="Instructor name"
									name="instructor"
									{...register('instructor', { required: true })}
								/>
								{errors.instructor && (
									<p className="text-red-500 text-xs">This field is required</p>
								)}
							</div>
						</div>
						<div className="flex  gap-2">
							<div className="mb-4 w-full">
								<label htmlFor="example" className="block text-sm">
									Price:
								</label>
								<input
									type="number"
									id="price"
									placeholder="price"
									className="input input-bordered w-full"
									{...register('price', { required: true })}
								/>
								{errors.price && (
									<p className="text-red-500 text-xs">This field is required</p>
								)}
							</div>
							<div className="mb-4 w-full">
								<label htmlFor="example" className="block text-sm">
									Instructor Email
								</label>
								<input
									type="email"
									id="example"
									placeholder="email"
									defaultValue={user?.email}
									readOnly
									className="input input-bordered w-full"
									{...register('email')}
								/>
								{errors.email && (
									<p className="text-red-500 text-xs">This field is required</p>
								)}
							</div>
						</div>

						<div className="mb-4">
							<label htmlFor="exampleRequired" className="block text-sm">
								Seat*
							</label>
							<input
								type="text"
								id="exampleRequired"
								placeholder="seat"
								className="input input-bordered w-full"
								{...register('seat', { required: true })}
							/>
							{errors.seat && (
								<p className="text-red-500 text-xs">This field is required</p>
							)}
						</div>

						<div className="form-control w-full my-4">
							<label className="label">
								<span className="label-text">Pick an Image*</span>
							</label>
							<input
								type="file"
								className="file-input file-input-bordered w-full"
								{...register('image', { required: true })}
							/>
							{errors.image && (
								<span className="text-red-500">Image is required.</span>
							)}
						</div>
						<input
							type="submit"
							value="Submit"
							className="btn btn-primary w-full my-3"
						/>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddAClass;
