const discord = require('discord.js');
const client = new discord.Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var prefix = "!";

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write()


client.login('NTQ4NzQ4MzEzMjAxOTk5ODg5.D1J14w.rbntqP4goJZnIb5mr-UYFHY8TSY');

client.on('ready', () => {
    console.log("Bot lancé")
    client.user.setActivity('online')
    client.user.setActivity('!help | Beta Only')
})

client.on('message', message =>{
    if(message.content === "Salut"){
        message.reply('Salut !:smile:');
        console.log('Un joueur nous à dis salut !');
    }
})

client.on('guildMemberAdd', member =>{
    member.guild.channels.get('548606274787606535').send(':tada: **Bienvenue !** ' + member.user + ' :smile: Nous sommes ' + member.guild.memberCount);
    console.log('Une personne à rejoint le serveur +1 !')
    member.addRole('548748179378798592')
})

client.on('guildMemberRemove', member =>{
    member.guild.channels.get('548606274787606535').send(':triumph: **Aurevoir.** ' + member.user + ' :cry: Nous sommes ' + member.guild.memberCount);
    console.log('Une nouvelle personne à quitter le serveur -1')
})

client.on('guildMemberAdd', member =>{
    member.guild.channels.get('548763330148565014').send(':tada: **Welcome !** ' + member.user + ' :smile: We are ' + member.guild.memberCount);
})

client.on('guildMemberRemove', member =>{
    member.guild.channels.get('548763330148565014').send(':triumph: **Goodbye.** ' + member.user + ' :cry: We are ' + member.guild.memberCount);
})

/*Kick*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLocaleLowerCase() === prefix + 'kick'){
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utilisez cette commande ;(")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez l'utilisateur ")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne voulez pas Kick cet utilisateur")
        if (!member.kickable) return message.channel.send("Je ne peux pas exlure cet utilisateur")
        member.kick()
        message.channel.send(member.user.username + ' à étais exlu :white_check_mark:')
    }
});

/*Ban*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLocaleLowerCase() === prefix + 'ban'){
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utilisez cette commande ;(")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez l'utilisateur ")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne voulez pas Bannir cet utilisateur")
        if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur")
        message.guild.ban(member, {days: 7})
        message.channel.send(member.user.username + ' à étais banni :white_check_mark:')
    }
});

/*Clear et Mute*/
client.on("message", message => {
    if(!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utilisez cette commande !")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombres de messages valides")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre de messages entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
    }

    if (args [0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermissions('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utilisez cette commande !")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Ce Membre est introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
            message.channel.send(member + ' a été mute :white_check_mark:')
            })
        }
    }
})

/*xp*/
client.on('message', message => {
    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()) {
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp)
        console.log(`Nombre d'xp: ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();
    if (message.content === prefix + "xp"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new discord.RichEmbed()
            .setTitle(`Stat des XP de ${message.author.username}`)
            .setColor('#F4D03F')
            .setDescription("Affichage des XP")
            .addField("XP:", `${xpfinal[1]} xp`)
            .setFooter("Bon jeu ! :p")
        message.channel.send({embed: xp_embed});
    
}}})

/*help*/
client.on('message', message =>{
    if (message.content === prefix + "help"){
        var help = new discord.RichEmbed()
            .setTitle("Help")
            .setColor("#DF0101")
            .setDescription("Voici la liste des commandes :")
            .addField("!help", "Voir les commandes")
            .addField("!xp", "voir son xp du serveur")
            .addField("!8ball <question>","Jeu : donner une question est le BOT répond !")
            .addField("!youtube", "Voir la chaine youtube du créateur | av = !yt")
            .addField("!twitter", "Voir le twitter du créateur | av = tt")
            .addField("!infodiscord", "Afiche les Informations du serveur discord")
            .addField("!infobot", "Afficher les infos du Bot")
            .setFooter("Bientôt de nouvelles règles !")
        message.channel.sendEmbed(help)
    }
})

/*8ball*/
client.on ('message',message =>{
    if(!message.guild) return;
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase()=== prefix + "8ball") {
        if(!args[1]) return message.channel.send("Veuillez envoyez **une question**")
        let rep = ["Oui","Non","Peut-être","Pas du tous","Je ne sais pas"]
        let reptaille = Math.floor((Math.random()* rep.length));
        let question = args.join(" ").slice(6);

        let embed = new discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("#0174DF")
            .addField("Question :", question)
            .addField("Réponse :", rep[reptaille]);
        message.channel.send(embed)
    }
})

/*youtube*/
client.on('message', message => {
    if (message.content === prefix + "youtube") {
        message.reply("Le chaîne YouTube du créateur : https://www.youtube.com/channel/UCw7Gm1tVfdSjyUsHT7x4lCA")
        console.log("Un joueur à executer la commande !youtube")
    }
})
client.on('message', message =>{
    if (message.content === prefix + "yt"){
        message.reply("La chaîne Youtube du créateur : https://www.youtube.com/channel/UCw7Gm1tVfdSjyUsHT7x4lCA")
        console.log("Un joueur a executer la commande !yt")
    }
});

/*twitter*/
client.on('message',message => {
    if (message.content === prefix + "twitter")
    message.reply("Le twitter du créateur : https://twitter.com/TomRobloxDev")
});

client.on('message',message => {
    if (message.content === prefix + "tt")
    message.reply("Le twitter du créateur : https://twitter.com/TomRobloxDev")
})

/*infodiscord*/
client.on('message',message => {
    if(message.content === prefix + "infodiscord") {
        var infodiscord = new discord.RichEmbed()
        .setDescription("Information du discord")
        .addField("Nom du discord : ", message.guild.name)
        .addField("Crée le", message.guild.createdAt)
        .addField("Tu as rejoin le", message.guild.joinedAt)
        .addField("Utilisateurs sur le discord :", message.guild.memberCount)
        .addField("Créateur du serveur : ", message.guild.owner)
        .addField("Créateur du BOT : ", "Flysen")
        .setColor("#A4A4A4")
    message.channel.sendEmbed(infodiscord)
    }
})

/*infobot*/
client.on('message', message => {
    if(message.content === prefix + "infobot")
    var infobot = new discord.RichEmbed()
    .setDescription("Information du Bot")
    .addField("Nom du Bot : ", "FlyguaBot")
    .addField("Créer le : ", "23/02/2019")
    .addField("Créer par : ", "Flysen")
    .addField("Bot pour : ", "serveur discord")
    .setFooter("Bonne continuation ! :D")
message.channel.sendEmbed(infobot)
})

/*site*/
client.on('message', message => {
    if(message.content === prefix + "site")
    message.reply(":white_check_mark: Nous sommes désoler mais le site web du **BOT** est encore en création :cry:")
})

/*ping*/
client.on('message', message => {
    if(message.content === prefix + "ping") {
        message.channel.send("Calcul ...").then(message => {
        message.edit('pong !' + Math.round(client.ping) + 'ms')
        })
    }
});
