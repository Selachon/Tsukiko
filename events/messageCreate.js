export default (Tsukiko, msg) => {
    if (msg.content.startsWith('+test')) {
        msg.channel.send('Funcionando')
    }
}