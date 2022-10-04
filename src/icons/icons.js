import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faUser,
  faPaintbrush,
  faCircleQuestion,
  faCircle,
  faEraser,
  faFloppyDisk,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

library.add(faUser);
library.add(faUsers);
library.add(faPaintbrush);
library.add(faEraser);
library.add(faCircleQuestion);
library.add(faCircle);
library.add(faFloppyDisk);

export default FontAwesomeIcon;
