const epsilon = '\0'

const aGraph = [
    {
        name: 0,
        links:[
            {
                to: 0,
                value: 'a',
            },
            {
                to: 0,
                value: 'b',
            },
            {
                to: 1,
                value: 'a',
            }
        ]
    },
    {
        name: 1,
        links:[
            {
                to: 2,
                value: 'b',
            }
        ]
    },
    {
        name: 2,
        links:[
            {
                to: 3,
                value: 'b',
            }
        ]
    },
    {
        name: 3,
        links:[
        ]
    },
  
]

module.exports = aGraph