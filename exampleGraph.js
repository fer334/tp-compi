const epsilon = '\0'

const aGraph = [
    {
        name: 0,
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
        name: 1,
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
        name: 2,
        links:[
            {
                to: 3,
                value: 'a',
            }
        ]
    },
    {
        name: 4,
        links:[
            {
                to: 5,
                value: 'b',
            }
        ]
    },
    {
        name: 3,
        links:[
            {
                to: 6,
                value: epsilon,
            }
        ]
    },
    {
        name: 5,
        links:[
            {
                to: 6,
                value: epsilon,
            }
        ]
    },
    {
        name: 6,
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
        name: 7,
        links:[
            {
                to: 8,
                value: 'a',
            }
        ]
    },
    {
        name: 8,
        links:[
            {
                to: 9,
                value: 'b',
            }
        ]
    },
    {
        name: 9,
        links:[
            {
                to: 10,
                value: 'b',
            }
        ]
    },
    {
        name: 10,
    },
]

module.exports = aGraph