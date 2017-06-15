package org.primefaces.extensions.component.orgchart;

import java.util.ArrayList;
import java.util.List;

public class DefaultOrgChartNode implements OrgChartNode {

    private String id;

    private String name;

    private String title;

    private String className;

    private List<OrgChartNode> children = new ArrayList<OrgChartNode>();

    private OrgChartNode parent;

    public DefaultOrgChartNode() {
        super();
    }

    public DefaultOrgChartNode(String id, String name, String title) {
        super();
        this.id = id;
        this.name = name;
        this.title = title;
    }

    public DefaultOrgChartNode(String name, String title) {
        super();
        this.name = name;
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<OrgChartNode> getChildren() {
        return children;
    }

    public void setChildren(List<OrgChartNode> children) {
        this.children = children;
    }

    public OrgChartNode getParent() {
        return parent;
    }

    public void setParent(OrgChartNode parent) {
        this.parent = parent;
    }

    public void addChild(OrgChartNode child) {
        this.children.add(child);
    }

    public void clearChildren() {
        this.children.clear();
    }

    public void clearParent() {
        this.parent = null;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

}
