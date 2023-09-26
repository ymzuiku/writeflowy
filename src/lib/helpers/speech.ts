let msg: SpeechSynthesisUtterance | null = null;

export function speech(text: string, rate: number) {
	if (!msg) {
		msg = new SpeechSynthesisUtterance();
	}
	// 创建一个新的 SpeechSynthesisUtterance 对象

	window.speechSynthesis.cancel();
	msg.text = text;
	msg.rate = rate;

	// 使用默认语音引擎合成并播放文本
	window.speechSynthesis.speak(msg);
}
