let io;
/* -----------------------------
   LIVE DATA TEST
------------------------------ */
let data = Array(60).fill(0);

function initSocket(socketIo){
	io = socketIo;
	
	setInterval(() => {

		const newValue =
			Math.floor(Math.random() * 100);

		data.shift();

		data.push(newValue);

		io.emit("liveChart", {
			tank1: data
		});

	}, 1000);
}



module.exports = {initSocket};