module.exports = {
    path: '/jobs',
    method: 'GET',
    access: "LIMIT",
    execute: (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (token && TokenUtils.isTokenValid(token)) {
            SQL.getConnection().then(connection => {
                return connection.query('SELECT * FROM jobs');
            }).then(jobs => {
                res.json(jobs);
            }).catch(err => {
                res.status(500).json({ error: 'Database error', details: err });
            });
        }
    }
}