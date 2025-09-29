const statsBound = (stat) => Math.max(-20, Math.min(20, Math.round(stat)));
module.exports = { statsBound };
