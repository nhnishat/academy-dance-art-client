import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
const Navbar = () => {
	const { user, logOut } = useAuth();

	const handleLogOut = () => {
		logOut()
			.then(() => {})
			.catch((error) => console.log(error));
	};

	const navOptions = (
		<>
			<li>
				<NavLink
					to="/"
					className={({ isActive }) =>
						isActive ? 'text-purple-500' : 'default'
					}
				>
					Home
				</NavLink>
			</li>
			<li>
				<NavLink
					to="/instructor"
					className={({ isActive }) =>
						isActive ? 'text-purple-500' : 'default'
					}
				>
					Instructors
				</NavLink>
			</li>
			<li>
				<NavLink
					to="/classes"
					className={({ isActive }) =>
						isActive ? 'text-purple-500' : 'default'
					}
				>
					Classes
				</NavLink>
			</li>
			{user && (
				<li>
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? 'text-purple-500' : 'default'
						}
					>
						Dashboard
					</NavLink>
				</li>
			)}
		</>
	);

	return (
		<>
			<div className="navbar bg-black rounded-xl mt-3 text-white">
				<div className="navbar-start">
					<div className="dropdown">
						<label tabIndex={0} className="btn btn-ghost lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</label>
						<ul
							tabIndex={0}
							className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box lg:w-52 sm:bg-white text-black"
						>
							{navOptions}
						</ul>
					</div>
					<a className="btn btn-ghost normal-case text-xl">XYZ</a>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">{navOptions}</ul>
				</div>
				<div className="navbar-end">
					{user ? (
						<>
							<img src={user?.image} alt="img" />
							<button onClick={handleLogOut} className="btn btn-ghost">
								LogOut
							</button>
						</>
					) : (
						<>
							<button className="mr-3">
								<NavLink
									to="/singin"
									className={({ isActive }) =>
										isActive ? 'text-purple-500' : 'default'
									}
								>
									Sing in
								</NavLink>
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Navbar;
