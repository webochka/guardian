import { TimelineMax } from 'gsap';

class Article {
  constructor(el) {
    this.el = el;

    this.list = document.getElementById('list');
    this.refreshBtn = document.getElementById('refresh');
    this.input = document.getElementById('input');
    this.pageBtn = document.getElementsByClassName('page__btn');

    this.animation = new TimelineMax();

    this.fetchTitle()
      .then(() => this.render())
      .then(() => this.events());
  }

  events() {
    this.refreshBtn.addEventListener('click', (e) => {
      this.refresh();
    });

    this.input.addEventListener('input', (e) => {
      if (this.input.value.length > 0) {
        input.setAttribute('value', this.input.value);
        this.refresh();
      }
      this.pagePrew();
      this.pageNext();
    });

    this.pageBtn[0].addEventListener('click', (e) => {
      this.input.value--;
      this.refresh();
      this.pagePrew();
      this.pageNext();
    });

    this.pageBtn[1].addEventListener('click', (e) => {
      this.input.value++;
      this.refresh();
      this.pagePrew();
      this.pageNext();
    });
  }

  refresh() {
    this.fetchTitle()
      .then(() => this.render());
  }

  fetchTitle() {
    this.url = `https://content.guardianapis.com/search?page=${this.input.value}&api-key=8993f650-bef9-4506-87e6-435b50a2e0ac`;
    return fetch(this.url)
      .then(response => response.json())
      .then(responseBody => {
        this.body = responseBody;

      });
  }

  fetchDesc(dataItem) {
    this.url = `https://content.guardianapis.com/${dataItem}?show-blocks=body&api-key=8993f650-bef9-4506-87e6-435b50a2e0ac`;
    return fetch(this.url)
      .then(response => response.json())
      .then(responseBody => {
        this.body = responseBody;
      });
  }

  pagePrew() {
    if (this.input.value <= 1) {
      this.pageBtn[0].classList.add('page__btn--is-hidden');
    }
    if (this.input.value > 1) {
      this.pageBtn[0].classList.remove('page__btn--is-hidden');
    }
  }

  pageNext() {
    if (this.input.value >= 1124) {
      this.pageBtn[1].classList.add('page__btn--is-hidden');
    }
    if (this.input.value < 1124) {
      this.pageBtn[1].classList.remove('page__btn--is-hidden');
    }
  }

  render() {
    this.renderTitle();
    this.renerDesc();
  }

  renderTitle() {
    var renderTitle = '';

    this.body.response.results.forEach(item => {
      renderTitle += `<li class="list__item list__item--is-close"><h2 class="list__title" data-link="${item.id}">${item.webTitle}</h2></li>`;
      return renderTitle;
    });

    this.list.innerHTML = renderTitle;

    this.animation
      .staggerFromTo('.list__item', 0.5, {y: -20, opacity: 0}, {y: 0, opacity: 1}, 0.1);
  }

  renerDesc() {

    var listTitle = document.getElementsByClassName('list__title');
    var listItem = document.getElementsByClassName('list__item');

    for (var i = 0; i < listTitle.length; i++) {

      listTitle[i].addEventListener('click', e => {
        var dataLink = e.target.getAttribute('data-link');

        this.fetchDesc(dataLink)
          .then(() => {

            var desc = this.body.response.content.blocks.body[0].bodyTextSummary;
            var link = this.body.response.content.webUrl;

            for (var i = 0; i < listTitle.length; i++) {
              var id = listTitle[i].setAttribute('data-id', `${i}`);
            }

            for (var i = 0; i < listItem.length; i++) {

              var id = e.target.getAttribute('data-id');

              if (i === +id) {

                if (listItem[id].childNodes[1]) {
                  listItem[id].removeChild(listItem[id].lastChild);
                }

                var div = document.createElement('div');
                div.innerHTML = `<p class="list__desc">${desc}</p><a class="list__link" href="${link}">Read full news</a>`;
                listItem[id].appendChild(div);
                div.classList.add('list__more');

                listItem[id].classList.toggle('list__item--is-close');
                listItem[id].classList.toggle('list__item--is-open');

              }

            }
          });

      });

    }

  }

}

var e = new Article();
