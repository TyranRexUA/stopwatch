import React, { useEffect, useRef, useState } from 'react';
import { fromEvent, interval, Observable } from 'rxjs';
import { map, buffer, debounceTime, filter } from 'rxjs/operators';
import './App.css';

let observable$: Observable<number> = interval(1000)
let subscriber: any;

const App: React.FC = () => {
    let [time, setTime] = useState<number>(0)
    let [isStart, setIsStart] = useState<boolean>(false)
    let ref = useRef(null)

    useEffect(() => {

        const click$: Observable<any> = fromEvent(ref.current as any, 'click')

        const doubleClick$ = click$
            .pipe(
                buffer(click$.pipe(debounceTime(300))),
                map(list => list.length),
                filter(x => x === 2),
            )

        const DoubleClickSubscriber$ = doubleClick$.subscribe(() => {
            setIsStart(false)
            subscriber.unsubscribe()
        })

        return () => {
            DoubleClickSubscriber$.unsubscribe()
        }
    }, [])

    const start = () => {
        setIsStart(true)
        subscriber = observable$.subscribe(() => {
            setTime(prevTime => ++prevTime)
        })
    }

    const stop = () => {
        setIsStart(false)
        setTime(0)
        subscriber.unsubscribe()
    }

    const reset = () => {
        stop()
        start()
    }

    return (
        <div className='App'>
            {Math.floor(time / 3600) + ":" + Math.floor(time / 60) + ":" + (time % 60)}

            <div className='btngroup'>

                <button onClick={isStart ? stop : start}>
                    {isStart ? 'Stop' : 'Start'}
                </button>

                <button ref={ref}>
                    Wait (doubleClick)
                </button>

                <button onClick={reset}>
                    Reset
                </button>

            </div>
        </div>
    );
}

export default App;
