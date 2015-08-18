$(document).ready(function() {
	navigator.getUserMedia = ( navigator.getUserMedia ||
					   navigator.webkitGetUserMedia ||
					   navigator.mozGetUserMedia ||
					   navigator.msGetUserMedia);

	var stream = {};
	var pear = {};
	var call = {};

	navigator.getUserMedia(
		{audio: true},

		// successCallback
		function(_stream) {
			stream = _stream;
			peer = new Peer({host: 'localhost', port: 9000, path: '/'});
			peer.on('open', function(id) {
				$('#id').text('Your ID is '+id);
			});

			// Receive A Call
			peer.on('call', function(call) {
				// Answer the call, providing our mediaStream
				  call.answer(stream);

				  // Got Data from call
				call.on('stream', handleStream);
			});

			var audio = document.querySelector('audio');
			audio.src = window.URL.createObjectURL(stream);
		},

		function(err) {
			console.log("The following error occured: " + err);
		}
	);

	// Make A Call
	$('#call-btn').click(function() {
		var id = $('#text').val()
		if(id == '') {
			alert('Provide An ID');
		} else {
			call = peer.call(id, stream);
			$('#connection').text('Calling...');
			call.on('stream', handleStream);
		}
	});

	handleStream = function(peer_stream) {
		$('#connection').text('Connected To Peer');
		var peer_audio = $('#peer-audio');
		peer_audio.attr('src', URL.createObjectURL(peer_stream));
		peer_audio.get(0).play();
	}
})
