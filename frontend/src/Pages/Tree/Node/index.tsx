import {useRef, useState, useEffect} from "react";

interface Props {
    toNodeX: number;
    toNodeY: number;
    hasChildren: boolean;
}

const Node = ({toNodeX = 0, toNodeY = 0, hasChildren = false}) => {

    const componentRef = useRef(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect();
            setX(rect.left + window.scrollX); // Horizontal position relative to the viewport
            setY(rect.top + window.scrollY); // Vertical position relative to the viewport
        }
    }, []);

    if(hasChildren) {
        const line = (
            <svg height="210" width="500">
                <line x1={x} y1={y} x2={toNodeX} y2={toNodeY} style={{ stroke: 'rgb(255,0,0)', strokeWidth: 2 }} />
            </svg>
        );
    }

    return (
        <div>

        </div>
    )
}

export default Node;