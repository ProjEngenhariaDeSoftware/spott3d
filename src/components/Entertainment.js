import React, { Component } from 'react';
import PostList from '../components/PostList';

export default class Entertainment extends Component {
  constructor(props) {
    super();
    this.posts = [
      {
        key: '0',
        username: 'matheusgr',
        userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5',
        title: 'Semana acadêmica',
        local: 'UFCG',
        date: 'de 22 a 24 de Outubro de 2018',
        image: true,
        imageurl: 'http://www.computacao.ufcg.edu.br/_/rsrc/1373053918398/departamento/informes/iisemanaacademicadacomputacaoufcg/Captura%20de%20Tela%202013-07-05%20%C3%A0s%2016.50.58.png',
        coments: [{ coment: "OI", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }],
      },

      {
        key: '2',
        username: 'cassio',
        userphoto: 'https://avatars1.githubusercontent.com/u/28960913',
        title: 'Python Nordeste',
        local: 'UFCG',
        date: 'de 26 a 29 de Outubro de 2018',
        image: true,
        imageurl: 'http://paraibacvb.com.br/wp-content/uploads/2018/03/pythonnordeste2018destaque.png',
        coments: [{ coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }],
      },
      {
        key: '3',
        username: 'hemi',
        userphoto: 'https://avatars2.githubusercontent.com/u/28992235',
        title: 'Mãe Hemi faz você passar em tudo!',
        local: 'UFCG',
        date: 'de 05 a 10 de Novembro de 2018',
        image: true,
        imageurl: 'https://joaobidu.com.br/wp-content/uploads/2016/08/pano-preto-em-cima-vela-vermela-acesa-e-cartas-de-taro-espalhadas-550x367.jpg',
        coments: [{ coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }],
      },

      {
        key: '4',
        username: 'Caio Sanches Batista de Lira',
        userphoto: 'https://trello-avatars.s3.amazonaws.com/8caa44c9195400719a12896ec4799f31/30.png',
        title: 'Venha aprender com o melhor!',
        local: 'UFCG',
        date: '30 de Outubro de 2018',
        image: true,
        imageurl: 'https://i.ytimg.com/vi/AKvzS0mMy-c/maxresdefault.jpg',
        coments: [{ coment: "RoadTop", userid: "caiosbl", userphoto: 'https://trello-avatars.s3.amazonaws.com/8caa44c9195400719a12896ec4799f31/30.png' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }]
      },
      {
        key: '5',
        username: 'matheusgr',
        userphoto: 'https://avatars0.githubusercontent.com/u/23560337',
        title: 'Melhor evento do mundo!',
        local: 'UFCG',
        date: '30 de Outubro de 2018',
        image: true,
        imageurl: 'https://t.tudocdn.net/319345',
        coments: [{ coment: "RoadTop", userid: "caiosbl", userphoto: 'https://trello-avatars.s3.amazonaws.com/8caa44c9195400719a12896ec4799f31/30.png' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }],
      },
      {
        key: '6',
        username: 'matheusgr',
        userphoto: 'https://avatars3.githubusercontent.com/u/12588175',
        title: 'Evento Roadsec',
        local: 'UFCG',
        date: '45 de Outubro de 2018',
        image: false,
        text: 'O Roadsec é o maior evento hacker da América Latina, durante o evento são apresentadas diversas palestras e oficinas de hacking, segurança da informação, ti e tecnologia em geral, além é claro de reunir profissionais, empresas e pessoas com o mesmo interesse, ou seja, como o Roadsec acaba sendo uma ótima forma de conhecer pessoas com os mesmos interesses que você, ou quem sabe até mesmo conseguir uma vaga de emprego ou simplesmente um networking.',
        coments: [{ coment: "RoadTop", userid: "caiosbl", userphoto: 'https://trello-avatars.s3.amazonaws.com/8caa44c9195400719a12896ec4799f31/30.png' }, { coment: "Vamos", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }, { coment: "Partiu", userid: "matheusgr", userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5' }]
      }
    ]

    this.state = {
    }
  }

  render() {
    return (
      <PostList dataPosts={this.posts} color='#179e8a'></PostList>
    );
  }
}