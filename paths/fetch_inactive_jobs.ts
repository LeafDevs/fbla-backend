const TokenUtils = require("./utils/Token");
const SQL = require("./utils/SQL");

module.exports = {
    path: "/jobs/fetch_inactive",
    method: "GET",
    access: "NO_LIMIT",
    execute: async (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (token) {
            try {
                const connection = await SQL.getConnection();
                const jobs = await connection.all('SELECT * FROM jobs WHERE accepted = "false"');
                const formattedJobs = jobs.map(job => {
                    const parsedTags = JSON.parse(job.tags.replace(/'/g, '"'));
                    const parsedQuestions = JSON.parse(job.questions.replace(/'/g, '"'));
                    return {
                        ...job,
                        tags: parsedTags,
                        questions: parsedQuestions
                    };
                });
                res.json(formattedJobs);
            } catch (err) {
                res.json({ code: 500, error: 'Database error', details: err });
            }
        } else {
            res.json({ code: 401, error: 'Unauthorized' });
        }
    }
}