using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MultiSellerIo.Dal.Migrations
{
    public partial class changeset03 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AttributeType",
                table: "CategoryAttributes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsGroup",
                table: "CategoryAttributes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttributeType",
                table: "CategoryAttributes");

            migrationBuilder.DropColumn(
                name: "IsGroup",
                table: "CategoryAttributes");
        }
    }
}
