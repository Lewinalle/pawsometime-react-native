export const formatUsersIdsParams = (userIds) => {
	let userIdsParam = '';
	userIds.map((id) => {
		if (userIdsParam !== '') {
			userIdsParam += ',';
		}
		userIdsParam += `"${id}"`;
	});
	userIdsParam = `[${userIdsParam}]`;

	return userIdsParam;
};
