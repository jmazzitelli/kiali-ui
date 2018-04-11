import Element from 'cytoscape';

const FLASH_BADGE: string = 'glyphicon glyphicon-flash';
const MAIL_BADGE: string = 'glyphicon glyphicon-envelope';

class GraphBadge {
  node: Element;
  badgeType: string;
  badgeColor: string;
  placement: string;

  constructor(node: Element, badgeType: string, badgeColor: string, placement: string) {
    this.node = node;
    this.badgeType = badgeType;
    this.badgeColor = badgeColor;
    this.placement = placement;
  }

  buildBadge() {
    const div = document.createElement('div');
    div.className = this.badgeType;
    div.style.color = this.badgeColor;
    div.style.zIndex = '3';
    div.style.position = 'absolute';
    this.node
      .cy()
      .container()
      .children[0].appendChild(div);

    const setScale = () => {
      const zoom = this.node.cy().zoom();
      div.style.transform = div.style.transform + `scale(${zoom},${zoom})`;
    };

    const popper = this.node.popper({
      content: target => div,
      renderedPosition: element => {
        // This offset is already added by cytoscape-popper, but we want
        // to considerate a different position, so we should remove it.
        // https://github.com/cytoscape/cytoscape.js-popper/blob/master/src/bb.js#L9
        const offset = element
          .cy()
          .container()
          .getBoundingClientRect();
        const position = this.node.renderedPosition();
        const zoom = this.node.cy().zoom();
        const zoomedWidth = div.clientWidth * zoom;
        const zoomedHeight = div.clientHeight * zoom;

        return { x: position.x - offset.left - zoomedWidth, y: position.y - offset.top - zoomedHeight };
      },
      popper: {
        positionFixed: false,
        modifiers: {
          offset: { offset: '50' },
          inner: { enabled: true },
          preventOverflow: {
            enabled: true,
            padding: 0
          },
          flip: {
            enabled: false
          }
        },
        placement: this.placement,
        onCreate: setScale,
        onUpdate: setScale
      }
    });

    let update = event => {
      popper.scheduleUpdate();
    };

    let destroy = event => {
      popper.destroy();
    };

    let highlighter = event => {
      // 'mousedim' is the class used by GraphHighlighter.
      // The opacity values are from GraphStyles.
      div.style.opacity = event.target.hasClass('mousedim') ? '0.3' : '1.0';
    };

    this.node.on('position', update);
    this.node.on('style', highlighter);
    this.node.cy().on('pan zoom resize', update);
    this.node.cy().on('destroy', destroy);
  }
}

export class CircuitBreakerBadge extends GraphBadge {
  constructor(node: Element) {
    super(node, FLASH_BADGE, 'red', 'top');
  }
}

export class MessageBadge extends GraphBadge {
  constructor(node: Element) {
    super(node, MAIL_BADGE, 'blue', 'bottom');
  }
}
