import React from 'react';
import Measure from 'react-measure'

const Card = ({children, title, subtitle, id, onResize}) => (
  <div id={id} className="card mdc-card mdc-theme--primary-bg mdc-card--theme-dark">
    <section className="mdc-card__primary">
      <h4 className="mdc-card__subtitle-small">{title}</h4>
    </section>
    <section className="mdc-card__supporting-text">
      <div className="measured-div">
        <Measure bounds onResize={onResize}>
          {({ measureRef }) =>
            <div ref={measureRef}>
              {children}
            </div>
          }
        </Measure>
      </div>
    </section>
  </div>
);

export default Card;
