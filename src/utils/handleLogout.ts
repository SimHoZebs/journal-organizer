const handleLogout = () => {
	localStorage.removeItem("userId");
	localStorage.removeItem("username");
	localStorage.removeItem("token");
};

export default handleLogout;
