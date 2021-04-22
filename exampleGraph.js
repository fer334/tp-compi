const epsilon = '\0'

const aGraph = [
    {
        id: 0,
        links:[
            {
                to: 1,
                value: epsilon,
            },
            {
                to: 7,
                value: epsilon,
            }
        ]
    },
    {
        id: 1,
        links:[
            {
                to: 2,
                value: epsilon,
            },
            {
                to: 4,
                value: epsilon,
            }
        ]
    },
    {
        id: 2,
        links:[
            {
                to: 3,
                value: 'a',
            }
        ]
    },
    {
        id: 4,
        links:[
            {
                to: 5,
                value: 'b',
            }
        ]
    },
    {
        id: 3,
        links:[
            {
                to: 6,
                value: epsilon,
            }
        ]
    },
    {
        id: 5,
        links:[
            {
                to: 6,
                value: epsilon,
            }
        ]
    },
    {
        id: 6,
        links:[
            {
                to: 7,
                value: epsilon,
            },
            {
                to: 1,
                value: epsilon,
            }
        ]
    },
    {
        id: 7,
        links:[
            {
                to: 8,
                value: 'a',
            }
        ]
    },
    {
        id: 8,
        links:[
            {
                to: 9,
                value: 'b',
            }
        ]
    },
    {
        id: 9,
        links:[
            {
                to: 10,
                value: 'b',
            }
        ]
    },
    {
        id: 10,
    },
]

export default aGraph