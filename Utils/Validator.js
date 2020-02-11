export const validator = (type, value) => {
	let regex;
	if (type === 'email') {
		regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	} else if (type === 'password') {
		regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#\$%\^\&*\)\(+=._-]{8,}$/;
	} else {
		return;
	}

	const condition = new RegExp(regex, 'g');
	return condition.test(value);
};
