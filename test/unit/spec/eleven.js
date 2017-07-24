import Eleven from '../../../src/eleven';

const $ = Eleven.query;

describe('Eleven())', () => {
  it('should create an eleven instance with the default config', () => {
    var container = $('<div id="eleven"></div><div id="stage"></div>').appendTo(document.body);
    const e = Eleven();
    expect(e.options).toEqual({
      autoRestart: true,
      container: '#eleven',
      debug: false,
      language: 'en-US',
      commands: [],
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      requiresWakeWord: true,
      speechAgent: 'Google UK English Female',
      stage: '#stage',
      useEngine: false,
      wakeCommands: ['eleven', '11'],
      wakeSound: 'audio/chime.mp3',
      wakeCommandWait: 10000,
      template: `
        <div class="eleven-container">
          <div class="eleven-container-inner">
            <div class="eleven-off">
              <span>ELEVEN</span>
            </div>
            <div class="eleven-on">
              <div class="bg"></div>
              <div class="waves"></div>
            </div>
          </div>
        </div>
      `
    });

    expect(e.container).toEqual(container.get(0));
  });
});
