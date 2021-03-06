import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Style } from 'radium';
import { connect } from 'react-redux';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-downward';
import { fetchSingleArticle, clearSelection } from '../actions/ArchiveActions';

import postStyles from '../styles/post';

import BackToTop from './BackToTop';

const style = {
  post : {
    padding : '40px 2.5% 0 2.5%'
  },

  postContent : {
    padding : '0 0 20px 0'
  },

  timeAndTag : {
    fontSize      : '1rem',
    letterSpacing : '1px',
    margin        : '20px 0 0 0',
    color         : '#aaa'
  },

  neighboursContainer : {
    position : 'relative',
    padding  : '0 0 15px 0'
  },

  neighbourIcons : {
    margin : '0 5px 0 0'
  },

  neighbourLinks : {
    verticalAlign : 'top',
    color         : '#FE6C64'
  }
};

class Post extends Component {
  static propTypes = {
    dispatch    : React.PropTypes.func.isRequired,
    routeParams : React.PropTypes.shape({
      articleName : React.PropTypes.string.isRequired
    }).isRequired,
    params : React.PropTypes.shape({
      articleName : React.PropTypes.string.isRequired
    }),
    article : React.PropTypes.shape({
      content : React.PropTypes.string,
      time    : React.PropTypes.shape({
        year  : React.PropTypes.string.isRequired,
        month : React.PropTypes.string.isRequired,
        day   : React.PropTypes.string.isRequired
      }),
      tags       : React.PropTypes.arrayOf(React.PropTypes.string),
      neighbours : React.PropTypes.shape({
        prevPost : React.PropTypes.string,
        nextPost : React.PropTypes.string
      })
    })
  };

  componentDidMount () {
    this.fetchArticleContent();
    // this.initDisqus();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.routeParams.articleName !== prevProps.routeParams.articleName) {
      $('html, body').animate({ scrollTop: 0 }, 400, () => {
        setTimeout(this.fetchArticleContent, 100);
      });
    }
    this.addSpaceToWords();
  }

  componentWillUnmount () {
    this.props.dispatch(clearSelection());
  }

  fetchArticleContent = () => {
    if ('none' === $('.blog-sidebar').css('display') || $('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
      });
    }
  }

  addSpaceToWords = () => {
    var containers = $(this.refs.content).find('p, li');
    const re = /[a-zA-Z0-9_# \.\-\/\\]+/g;
    for (let i = 0; i < containers.length; ++i) {
      if ('BLOCKQUOTE' !== containers[i].parentElement.tagName) {
        for (let j = 0; j < containers[i].childNodes.length; ++j) {
          let node = containers[i].childNodes[j];
          if (0 === node.childNodes.length) {
            let words = $.unique(node.textContent.match(re) || []).filter(t => (/[a-zA-Z0-9]+/g).test(t));
            words.forEach(word => {
              let wordRE = new RegExp(word, 'g');
              node.textContent = node.textContent.replace(wordRE, ` ${word} `);
            });
          }
        }
      }
    }
  };

  initDisqus = () => {
    var d = document;
    var s = d.createElement('script');
    s.src = '//xhu.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  };

  render () {
    const { article } = this.props;

    const prevPost = (article.neighbours && article.neighbours.prevPost) || '';
    const prevPostTitle = prevPost.split('*')[1];
    const nextPost = (article.neighbours && article.neighbours.nextPost) || '';
    const nextPostTitle = nextPost.split('*')[1];

    const title = this.props.params.articleName.split('*')[1];
    document.title = `Life of xhu - ${title}`;

    return (
      <div style = {style.post}>
        <Style rules = {postStyles} />
        <div style = {style.postContent}>
          <div
            ref = 'content'
            dangerouslySetInnerHTML = {{ __html: article ? article.content : '' }}
          />
          {article.time ? (
            <div style = {style.timeAndTag}>
              {article.time && article.time.month} /&nbsp;
              {article.time && article.time.day} /&nbsp;
              {article.time && article.time.year}
              {article.tags && article.tags.map(tag => ' · ' + tag).join('')}
            </div>
          ) : null}
        </div>

        <div style = {style.neighboursContainer}>
          {prevPost ? (
            <div>
              <ArrowDropUp style = {style.neighbourIcons} />
              <Link to = {`/post/${prevPost}`} style = {style.neighbourLinks}>
                {prevPostTitle}
              </Link>
            </div>
          ) : null}

          {nextPost ? (
            <div>
              <ArrowDropDown style = {style.neighbourIcons} />
              <Link to = {`/post/${nextPost}`} style = {style.neighbourLinks}>
                {nextPostTitle}
              </Link>
            </div>
          ) : null}
        </div>
        <BackToTop />
        <div id = 'disqus_thread' />
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    article : state.archive.selectedArticle
  };
};

export default connect(mapStateToProps)(Post);
