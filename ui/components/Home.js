import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllArticles } from '../actions/ArchiveActions';

class Home extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ($('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchAllArticles());
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchAllArticles());
      })
    }
  }

  render () {
    const { archives } = this.props;
    var titleWithSnippet = archives.map((archive) => {
      return (
        <div className='ui tall stacked segments' key={archive.sequence}>
          <div className='ui top attached segment'>
            <p style={{
              color: '#777',
              fontWeight: '700',
              padding: '0 0 0 5px'
            }}>
              {archive.time.month} 月&nbsp;
              {archive.time.day} 日&nbsp;
              {archive.time.year}
              {archive.tags.map(tag => ' · ' + tag).join('')}
            </p>
          </div>

          <div dangerouslySetInnerHTML={{__html: archive.snippet}} style={{
            padding: '15px 15px 10px 15px'
          }}/>

          <div className='ui bottom attached clearing segment'>
            <Link to={`/archives/${archive.name}`} className="ui right floated button" style={{
              backgroundColor: '#ffffff'
            }}>
              Continue Reading
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div>
        {titleWithSnippet}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
}

export default connect(mapStateToProps)(Home);