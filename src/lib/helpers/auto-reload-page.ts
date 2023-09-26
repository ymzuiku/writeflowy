let idleTimeout: NodeJS.Timeout | null = null;

// 每 10 分钟刷新一次页面
export function autoReloadPage(idleTime = 1000 * 60 * 10) {
	if (typeof window === 'undefined') {
		return;
	}
	function resetIdleTimer() {
		if (idleTimeout) {
			clearTimeout(idleTimeout);
		}

		idleTimeout = setTimeout(function () {
			// 在用户长时间不活动后执行刷新操作
			location.reload();
		}, idleTime);
	}

	// 用户行为重置 timer
	document.addEventListener('mousedown', resetIdleTimer);
	document.addEventListener('touchstart', resetIdleTimer);
	resetIdleTimer();
}
