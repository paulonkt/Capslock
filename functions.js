const REQUEST_URL = "https://slowpoke.keev.me/slowpoke.php";

/**
 * Create a square with specified size.
 * @param {number} size The size of the square (default 100px).
 * @returns {HTMLElement} The created square element.
 */
function createSquare(size = 100) {
	const square = document.createElement('div');
	square.style.position = 'absolute';
	square.style.top = '0';
	square.style.left = '0';
	square.style.width = `${size}px`;
	square.style.height = `${size}px`;
	square.style.backgroundColor = 'black';
	document.body.appendChild(square);
	return square;
}

/**
 * Move the square a specified distance horizontally with smooth transition.
 * @param {HTMLElement} square The square element to move.
 * @param {number} distance The distance to move the square (default 100px).
 * @param {number} duration Duration of the movement in milliseconds (default 1000ms).
 * @returns {Promise} Resolves when the movement is complete.
 */
function startMovement(square, distance = 100, duration = 1000) {
	return new Promise((resolve) => {
		square.style.transition = `left ${duration}ms linear`;
		square.style.left = `${distance}px`;

		// Resolve the promise after the square stops moving
		setTimeout(resolve, duration);
	});
}

/**
 * Make a GET request to the specified URL.
 * @param {string} url The URL to make the request to.
 * @returns {Promise} Resolves with the result of the request or 'error' if it fails.
 */
function makeRequest(url) {
	return fetch(url)
		.then(response => {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error('Network error');
			}
		})
		.catch(() => 'error');
}

/**
 * Change the color of the square based on the request result.
 * @param {HTMLElement} square The square element to change color.
 * @param {string} result The result from the request ('1', '0', or 'error').
 */
function changeColor(square, result) {
	switch (result) {
		case '1':
			square.style.backgroundColor = 'green';
			break;
		case '0':
			square.style.backgroundColor = 'blue';
			break;
		default:
			square.style.backgroundColor = 'red';
			break;
	}
}

/**
 * Control the movement of the square and the request in parallel.
 * @param {string} url The URL to send the request to.
 */
function moveAndFetch(url) {
	const square = createSquare();
	const requestPromise = makeRequest(url);

	// Start the square's movement after 1 second
	setTimeout(async () => {
		// Start the square's movement
		await startMovement(square);

		// Once the square finishes moving, set the color based on the request result
		const result = await requestPromise;
		changeColor(square, result);
	}, 1000);
}

// Start the function
moveAndFetch(REQUEST_URL);