
import Tree from "react-d3-tree";


const orgChart = {
    name: 'Skill Diff',
    children: [
        {
            name: 'Skill1',
            attributes: {
                department: 'sus',
            },
            children: [
                {
                    name: 'Skill 1',
                    attributes: {
                        department: 'sus',
                    },
                    children: [
                        {
                            name: 'bruuhhh',
                        },
                    ],
                },
                {
                    name: 'Skill 2',
                    attributes: {
                        department: 'sus',
                    },
                    children: [
                        {
                            name: '????',
                        },
                    ],
                },
            ],
        },
    ],
};

const TreeGraph = () => {

    return (
        <div className={'bg-cyan-950 h-screen w-screen '}>
            <div id="treeWrapper" className={'w-full h-full top-10 left-1/2'}>
                <Tree data={orgChart} translate={{x: 300, y: 100}}orientation={90}/>
            </div>
        </div>
    )
}

export default TreeGraph;