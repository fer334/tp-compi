


function Graph(){
    this.graph =[]
    this.copyGraph=()=>{
        return JSON.parse(JSON.stringify(this.graph))
    }    
    this.setGraph=(graph)=>{
        this.graph=graph
    }
}




module.exports = Graph