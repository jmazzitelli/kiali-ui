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
    // div.style.zIndex = '0';
    document.getElementById('cy')!.appendChild(div);

    const setScale = () => {
      const zoom = this.node.cy().zoom();
      div.style.transform = div.style.transform + `scale(${zoom},${zoom})`;
    };

    const popper = this.node.popper({
      content: target => div,
      popper: {
        positionFixed: true,
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
