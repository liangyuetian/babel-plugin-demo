class C {
    constructor(props) {
    }

    #id = Math.random()

    name = 'c'

    getName() {
        return this.name
    }

    static main() {
        console.log('main')
    }
}