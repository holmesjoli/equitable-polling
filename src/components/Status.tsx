import Draggable from 'react-draggable';

export default function Status ({children}: {children: any}) {

    return (
      <Draggable bounds="body">
        <div className="Status">
            {children}
        </div>
      </Draggable>
    );
}
