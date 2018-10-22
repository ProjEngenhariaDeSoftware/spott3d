import React, { Component } from 'react';
import PostList from '../components/PostList';


export default class Spotted extends Component {
  constructor(props) {
    super();
    this.posts = [
      {
        key: '0',
        userphoto: 'https://conteudo.imguol.com.br/p/pp/2016/seguranca/sos/curiosidades/materia/141_dicascuriosidades_materia.jpg',
        title: 'Procura-se',
        local: 'UFCG - BG',
        date: '25 de outubro umas 13:40',
        image: false,
        text: 'Quem é a menina magrinha e alta de calça preta e blusa jeans que passou em frente ao bg uma 13:40 mais ou menos. Ela tava com uma mochila nas costas. Ia tira uma foto, mas ela passou rápido e não deu tempo. Mas se ela tiver instagaram marquem ela aqui, por favor. Valeu',
        coments: '12',
      },

      {
        key: '2',
        userphoto: 'https://conteudo.imguol.com.br/p/pp/2016/seguranca/sos/curiosidades/materia/141_dicascuriosidades_materia.jpg',
        title: 'Como que faz pra chegar no coração desse boy?',
        local: 'UFCG',
        date: '25 de Outubro',
        image: true,
        imageurl: 'https://scontent.fcpv3-1.fna.fbcdn.net/v/t1.0-1/39982762_1650237888439240_7068462746882277376_n.jpg?_nc_cat=110&_nc_ht=scontent.fcpv3-1.fna&oh=508feca5c76c16743cd579e3e04f35f6&oe=5C437354',
        coments: '115',
      },
      {
        key: '3',
        userphoto: 'https://conteudo.imguol.com.br/p/pp/2016/seguranca/sos/curiosidades/materia/141_dicascuriosidades_materia.jpg',
        title: 'Marquem ela pf.',
        local: 'UFCG - Lanchonete',
        date: '23 de outubro por volta das 10:00h',
        image: false,
        text: 'Um amigo meu tá doido numa galera loira dos olhos verdes que estava de calça preta e bota marrom hj na lanchonete do laguinho por volta das 10h. Solteira?',
        coments: '220',
      },
      {
        key: '5',
        userphoto: 'https://conteudo.imguol.com.br/p/pp/2016/seguranca/sos/curiosidades/materia/141_dicascuriosidades_materia.jpg',
        title: 'Solteira?',
        local: 'UFCG',
        date: '30 de Outubro de 2018',
        image: true,
        imageurl: 'https://scontent.fcpv3-1.fna.fbcdn.net/v/t1.0-9/39090081_1173219522818126_1470822094659911680_n.jpg?_nc_cat=108&_nc_ht=scontent.fcpv3-1.fna&oh=95c5e94c33f5d8db8a6239ac752161bf&oe=5C494C65',
        coments: '320',
      },
      {
        key: '6',
        userphoto: 'https://conteudo.imguol.com.br/p/pp/2016/seguranca/sos/curiosidades/materia/141_dicascuriosidades_materia.jpg',
        title: 'Victor de história do 5°período',
        local: 'UFCG',
        date: '45 de Outubro de 2018',
        image: false,
        text: 'Agr eu to interessada em saber se Victor de história do 5°período ta solteiro?? Ele sorriu pra mim e eu xonei, Victor vem viver a nossa história!!',
        coments: '320'
      }
    ]

    this.state = {
      dataSource: this.posts,
    }
  }

  render() {
    return (
      <PostList dataPosts={this.state.dataSource} color='#EC5D73'></PostList>
    );
  }
}