import App from './App.svelte';

const app = new App({
	target: document.body
});

document.ondblclick = function(e) {
	e.preventDefault();
}

export default app;